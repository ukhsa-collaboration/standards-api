#!/usr/bin/env python3
"""
Extract lowest-level (leaf) Business Capabilities from a diagrams.net XML
file and optionally emit them into a TypeScript module.

Example CLI usage:
    python src/capabilities.py path/to/capabilities.xml \
        --ts-out src/functions/ukhsa-business-capabilities.ts
"""

import argparse
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def extract_leaf_capabilities(xml_path: Path, *, sort: bool = True) -> list[str]:
    """
    Parse a diagrams.net XML file and return the list of lowest-level
    (leaf) Business Capabilities.

    Definition of a "leaf" capability:
      • It is represented by an <object> element with attributes
        type="factSheet" and factSheetType="BusinessCapability".
      • It is not the parent of any other BusinessCapability object (i.e.,
        no other BusinessCapability's <mxCell> references this object's id
        via its "parent" attribute).

    Args:
        xml_path:
            Path to the XML file containing an <diagrams.net> root element.
        sort:
            If True (default), return labels sorted case-insensitively.

    Returns:
        A list of unique capability labels (strings). Empty labels are ignored.
        Duplicates (case-sensitive) are removed.

    Raises:
        RuntimeError:
            If the file cannot be read or the XML cannot be parsed.

    Notes:
        This function is robust to typical diagrams.net exports where
        Business Capabilities may be represented as "swimlanes" (containers)
        and/or "labels" (children). Only BusinessCapability <object> nodes
        are considered. Parent/child linkage is inferred from the nested
        <mxCell parent="..."> attribute.
    """
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
    except Exception as exc:
        raise RuntimeError(f"Error reading/parsing XML: {exc}") from exc

    # Collect BusinessCapability objects and their parent references
    bc_by_id: dict[str, dict[str, str | None]] = {}
    parent_ids: set[str] = set()

    for obj in root.iter("object"):
        if obj.get("type") != "factSheet":
            continue
        if obj.get("factSheetType") != "BusinessCapability":
            continue

        obj_id = obj.get("id")
        if not obj_id:
            # Skip malformed objects without an id
            continue

        label = (obj.get("label") or "").strip()

        parent: str | None = None
        mxcell = obj.find("mxCell")
        if mxcell is not None:
            parent = mxcell.get("parent")

        bc_by_id[obj_id] = {"label": label, "parent": parent}

    # Identify which BCs act as parents of other BCs
    for info in bc_by_id.values():
        parent = info["parent"]
        if parent and parent in bc_by_id:
            parent_ids.add(parent)

    # Leaf = BC that is not a parent of any other BC
    leaf_ids: list[str] = [bid for bid in bc_by_id.keys() if bid not in parent_ids]

    # Build unique, non-empty labels
    seen: set[str] = set()
    labels: list[str] = []
    for bid in leaf_ids:
        label = bc_by_id[bid]["label"] or ""
        if label and label not in seen:
            labels.append(label)
            seen.add(label)

    if sort:
        labels.sort(key=str.lower)

    return labels


def write_ts_file(capabilities: list[str], out_path: Path) -> None:
    """
    Safely write a TypeScript file declaring and exporting a CAPABILITIES array.

    The emitted module has the following shape:

        const CAPABILITIES = [
          "Clinical Analysis",
          "Scientific Analysis",
          ...
        ];

        export default CAPABILITIES;

    Args:
        capabilities:
            The capability labels to emit.
        out_path:
            Destination file path for the TypeScript module.

    Behavior:
        • Ensures the parent directory exists (if any).
        • Writes to a temporary file first, then atomically replaces the target.
        • Uses JSON string encoding for each element to safely handle quotes,
          Unicode, and escape sequences.

    Raises:
        OSError:
            If the file cannot be written or replaced.
    """
    if out_path.parent:
        out_path.parent.mkdir(parents=True, exist_ok=True)

    # Serialize each capability as a JSON string literal to ensure valid TS.
    lines = ",\n".join(f"  {json.dumps(cap)}" for cap in capabilities)
    ts_content = (
        "const CAPABILITIES = [\n"
        f"{lines}\n"
        "];\n\n"
        "export default CAPABILITIES;\n"
    )

    tmp_path = out_path.with_suffix(out_path.suffix + ".tmp")
    tmp_path.write_text(ts_content, encoding="utf-8")

    tmp_path.replace(out_path)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """
    Parse command-line arguments.

    Args:
        argv:
            Optional list of argument strings. If None, defaults to sys.argv[1:].

    Returns:
        argparse.Namespace with parsed arguments.
    """
    parser = argparse.ArgumentParser(
        description=(
            "Extract lowest-level (leaf) Business Capabilities from an "
            "diagrams.net XML file. Optionally emit a TypeScript module."
        )
    )
    parser.add_argument(
        "xml_path",
        type=Path,
        help="Path to the diagrams.net XML file (e.g., capabilities.xml).",
    )
    parser.add_argument(
        "--ts-out",
        type=Path,
        default=None,
        help=(
            "Optional path to write a TypeScript file, e.g., "
            "src/functions/ukhsa-business-capabilities.ts"
        ),
    )
    parser.add_argument(
        "--sort",
        dest="sort",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Sort capability labels alphabetically (default: enabled).",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    """
    CLI entry point.

    Behavior:
        • Extract leaf capabilities from the provided XML.
        • Print them to stdout (one per line).
        • If --ts-out is provided, also write the TypeScript module and print a
          short confirmation to stderr.

    Exit codes:
        0 on success, non-zero on error.
    """
    args = parse_args(argv)

    try:
        caps = extract_leaf_capabilities(args.xml_path, sort=args.sort)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)

    for cap in caps:
        print(cap)

    if args.ts_out:
        try:
            write_ts_file(caps, args.ts_out)
            print(
                f"\n✅ Wrote {len(caps)} capabilities to {args.ts_out}",
                file=sys.stderr,
            )
        except OSError as exc:
            print(f"Failed to write TypeScript file: {exc}", file=sys.stderr)
            sys.exit(2)


if __name__ == "__main__":
    main()

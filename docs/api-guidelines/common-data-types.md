---
order: 13
---

# Common Data Types

API types **MUST** use standard data formats.

[Open API][1] (based on [JSON Schema Validation vocabulary][2]) defines formats from ISO and IETF standards for date/time, integers/numbers and binary data.

APIs **MUST** use these formats, whenever applicable:

## OpenAPI Formats Registry

The following list is provided for brevity and includes examples but please use [OpenAPI Formats Registry][3] as the master list.

| OpenAPI format | OpenAPI type | Specification | Example |
| - | - | - | - |
| `bigint` | `integer` | arbitrarily large signed integer number | `7.72E+19` |
| `binary` | `string` | [base64url encoded byte sequence following RFC7493 Section 4.4][4] | `"VGVzdA=="` |
| `byte` | `string` | [base64url encoded byte following RFC7493 Section 4.4][4] | `"VA=="` |
| `date` | `string` | [RFC3339][5] internet profile - subset of [ISO 8601][6]. | `"2019-07-30"` |
| `date-time` | `string` | [RFC3339][5] internet profile - subset of [ISO 8601][6]. | `"2019-07-30T06:43:40.252Z"` |
| `decimal` | `number` | arbitrarily precise signed decimal number | `3.141593` |
| `double` | `number` | [binary64 double precision decimal number - see IEEE 754-2008/ISO 60559:2011][7] | `3.141593` |
| `duration` | `string` | [RFC3339][5] - subset of [ISO 8601][6]. | `"P1DT3H4S"` |
| `email` | `string` | [RFC5322][8] | `"example@example.com"` |
| `float` | `number` | [binary32 single precision decimal number - see IEEE 754-2008/ISO 60559:2011][7] | `3.141593` |
| `hostname` | `string` | [RFC1034][9] | `"www.example.com"` |
| `idn-email` | `string` | [RFC6531][10] | `"hello@bücher.example"` |
| `idn-hostname` | `string` | [RFC5890][11] | `"bücher.example"` |
| int32 | integer | 4 byte signed integer between -2<sup>31</sup> and 2<sup>31</sup>-1 | `7.72E+09` |
| int64 | integer | 8 byte signed integer between -2<sup>63</sup> and 2<sup>63</sup>-1 | `7.72E+14` |
| ipv4 | string | [RFC2673][12] | `"104.75.173.179"` |
| ipv6 | string | [RFC4291][13] | `"2600:1401:2::8a"` |
| `iri` | `string` | [RFC3987][14] | `"https://bücher.example/"` |
| `iri-reference` | `string` | [RFC3987][14] | `"/damenbekleidung-jacken-mäntel/"` |
| `json-pointer` | `string` | [RFC6901][15] | `"/items/0/id"` |
| `password` | `string` | | `"secret"` |
| `period` | `string` | [RFC3339][5] - subset of [ISO 8601][6]. | `"2022-06-30T14:52:44.276/PT48H" "PT24H/2023-07-30T18:22:16.315Z" "2024-05-15T09:48:56.317Z/.."` |
| `regex` | `string` | [regular expressions as defined in ECMA 262][16] | `"^[a-z0-9]+$"` |
| `relative-json-pointer` | `string` | [Relative JSON pointers][17] | `"1/id"` |
| `time` | `string` | [RFC3339][5] internet profile - subset of [ISO 8601][6]. | `"06:43:40.252Z"` |
| `uri` | `string` | [RFC3986][18] | `"https://www.example.com/"` |
| `uri-reference` | `string` | [RFC3986][18] | `"/clothing/"` |
| `uri-template` | `string` | [RFC6570][19] | `"/users/{id}"` |
| `uuid` | `string` | [RFC4122][20] | `"e2ab873e-b295-11e9-9c02-…​"` |

## Additional Formats

APIs **SHOULD** also consider using the following formats.

| format | OpenAPI type | Specification | Example |
| - | - | - | - |
| `bcp47` | `string` | multi letter language tag - see [BCP 47][21].<br>It is a compatible extension of [ISO 639-1][22] optionally with additional information for language usage, like region, variant, script. | `"en-DE"` |
| `gtin-13` | `string` | Global Trade Item Number - see [GTIN][23] | `"5710798389878"` |
| `iso-3166-alpha-2` | `string` | two letter country code - see [ISO 3166-1 alpha-2][24]. | `"GB"` Hint: It is `"GB"` not `"UK"`. |
| `iso-4217` | `string` | three letter currency code - see [ISO 4217][25] | `"EUR"` |
| `iso-639-1` | `string` | two letter language code - see [ISO 639-1][22]. | "en" |

[1]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#data-types
[2]: https://tools.ietf.org/html/draft-bhutton-json-schema-validation-00#section-7.3
[3]: https://spec.openapis.org/registry/format/
[4]: https://datatracker.ietf.org/doc/html/rfc7493#section-4.4
[5]: https://datatracker.ietf.org/doc/html/rfc3339
[6]: https://datatracker.ietf.org/doc/html/rfc3339#ref-ISO8601
[7]: https://en.wikipedia.org/wiki/IEEE_754
[8]: https://datatracker.ietf.org/doc/html/rfc5322
[9]: https://datatracker.ietf.org/doc/html/rfc1034
[10]: https://datatracker.ietf.org/doc/html/rfc6531
[11]: https://datatracker.ietf.org/doc/html/rfc5890
[12]: https://datatracker.ietf.org/doc/html/rfc2673
[13]: https://datatracker.ietf.org/doc/html/rfc4291
[14]: https://datatracker.ietf.org/doc/html/rfc3987
[15]: https://datatracker.ietf.org/doc/html/rfc6901
[16]: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
[17]: https://datatracker.ietf.org/doc/html/draft-handrews-relative-json-pointer
[18]: https://datatracker.ietf.org/doc/html/rfc3986
[19]: https://datatracker.ietf.org/doc/html/rfc6570
[20]: https://datatracker.ietf.org/doc/html/rfc4122
[21]: https://datatracker.ietf.org/doc/html/bcp47
[22]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
[23]: https://en.wikipedia.org/wiki/Global_Trade_Item_Number
[24]: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
[25]: https://en.wikipedia.org/wiki/ISO_4217

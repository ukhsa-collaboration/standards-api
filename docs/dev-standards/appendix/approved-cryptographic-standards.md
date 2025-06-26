# Approved cryptographic standards

## Introduction

This appendix lists the approved cryptographic standards for use all systems. These standards help ensure that data remains protected in transit and at rest, and that cryptographic operations are implemented securely and consistently.

Teams **MUST** follow these standards when designing, implementing or reviewing encryption in digital services.

## Types of encryption

### Symmetric encryption

Symmetric encryption uses the same key for both encryption and decryption. It is typically used for encrypting data at rest or in high-performance scenarios.

Approved algorithms:

- **AES-256** (Advanced Encryption Standard with 256-bit key)
- **ChaCha20** (where supported and appropriate)

### Asymmetric encryption

Asymmetric encryption uses a public/private key pair. It is commonly used for secure key exchange, digital signatures and encrypting small payloads.

Approved algorithms:

- **RSA** with key size **≥ 2048 bits**
- **Elliptic Curve Cryptography (ECC)** using **secp256r1 (P-256)** or stronger

## Key exchange algorithms

Approved algorithms for secure key exchange:

- **ECDHE** (Elliptic Curve Diffie-Hellman Ephemeral)
- **RSA** (for legacy compatibility only)

## Hash functions and message authentication

Approved algorithms:

- **SHA-256** or **SHA-3** for hashing
- **HMAC-SHA-256** for message authentication codes (MACs)

## TLS and SSL

- Only **TLS 1.2** and **TLS 1.3** are approved.
- **SSL** (any version) **MUST NOT** be used.
- Cipher suites **MUST** support forward secrecy and use strong encryption (e.g. ECDHE with AES-GCM).

## Full disk encryption

- Devices and virtual machines **MUST** use full disk encryption.
- Approved technologies include **BitLocker**, **LUKS**, and **AWS EBS encryption** with **KMS-managed keys**.

## SSH

- SSH keys **MUST** use **RSA (≥ 2048 bits)** or **ED25519**.
- Password-based SSH authentication **MUST NOT** be used.

## Post-quantum cryptography

Post-quantum algorithms are under evaluation. Teams **SHOULD** monitor guidance from NCSC and NIST and **MAY** begin testing hybrid or quantum-resistant algorithms in non-production environments.

## Things to avoid

Teams **MUST NOT**:

- Use deprecated algorithms such as **MD5**, **SHA-1**, or **RC4**
- Use hardcoded or shared encryption keys
- Use custom or proprietary cryptographic algorithms

## References

- [NCSC Cryptographic Guidance](https://www.ncsc.gov.uk/section/advice-guidance/all-topics?topics=Cryptography&sort=date%2Bdesc)
- [NIST Cryptographic Standards](https://www.nist.gov/cryptography)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [UKHSA Encryption Standards](https://ukhsa.atlassian.net/wiki/spaces/AT/pages/170627302/Encryption+Standards)

# Security Policy

## Security Policy for Endpoint

Thank you for using Endpoint. We take security seriously and value the input from security researchers and our user community in helping to identify and address security vulnerabilities.

## Supported Versions

Only the latest major version of Endpoint is currently supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge your contributions.

### How to Submit a Report

1. **For critical security vulnerabilities**: Please email us directly at [security@endpointapp.io](mailto:security@endpointapp.io) with the subject line "Endpoint Security Vulnerability."

2. **For non-critical security issues**: Submit a GitHub issue with the label "security" (but please do not include exploit code or detailed vulnerability information in public issues).

### What to Include in Your Report

- A clear description of the vulnerability
- Steps to reproduce the issue
- The version of Endpoint you're using
- Any applicable screenshots or proof of concept
- The potential impact of the vulnerability
- Any ideas for mitigating or fixing the issue

### What to Expect After Submission

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 72 hours.
- **Status Updates**: We will keep you informed about the progress toward addressing the vulnerability.
- **Resolution Timeline**: Our goal is to address critical vulnerabilities within 30 days of verification.
- **Public Disclosure**: We coordinate public disclosure after the vulnerability has been fixed.

## Security Best Practices for Users

### Protecting Your Data

1. **API Credentials**: Never store sensitive API credentials directly in your Endpoint collections without using environment variables or secure storage.

2. **Authentication Tokens**: Regularly rotate authentication tokens, especially if you suspect a security breach.

3. **Data Exposure**: Be cautious about what data you include in your API requests and consider sanitizing sensitive information before sharing collections.

### Application Security

1. **Keep Updated**: Always use the latest version of Endpoint to benefit from security patches and updates.

2. **Review Permissions**: The application requires certain permissions to function. Review these and ensure they align with your security policies.

3. **Proxy Settings**: If using proxy features, ensure they're properly configured to prevent unintended data exposure.

## Security Features

Endpoint includes several security features to help protect your data:

- **Encrypted Storage**: Sensitive data is stored using encryption at rest
- **Environment Variables**: Secure storage of credentials and tokens using environment variables
- **Sandboxed Execution**: Scripts run in a sandboxed environment to prevent unauthorized system access
- **TLS/SSL Support**: Secure communication with APIs using modern TLS protocols

## Third-Party Libraries and Dependencies

We regularly monitor and update third-party dependencies to address known vulnerabilities. Our security team receives alerts for vulnerabilities in our dependency chain and addresses them promptly.

## Security Updates

Security updates are released as part of our regular release cycle or as emergency patches for critical vulnerabilities. Please keep your installation updated to benefit from these improvements.

## Bug Bounty Program

We currently do not have a formal bug bounty program, but we recognize security researchers who report valid vulnerabilities in our security acknowledgments.

## Security Acknowledgments

We would like to thank the following individuals who have helped improve the security of Endpoint:

- (This section will be updated as we receive and verify security reports)

---

This security policy may be updated from time to time. Please check back regularly for any changes.

Last Updated: [March 26, 2025]

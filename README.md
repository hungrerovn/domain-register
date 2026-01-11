# 🌐 Hrv Clan Domain Project
Welcome to the **Hrv Clan** free subdomain registration project! We offer free subdomains to developers and creators to deploy open-source projects.
## 🛠 How to Register
To own a subdomain, follow these steps:
1. **Fork** this repository to your GitHub account.
2. Create a new JSON file in the `domains/` directory with the name of your desired subdomain (e.g., `yourname.json`).
3. Fill in the configuration information (see sample below).
4. **Commit** the changes and create a **Pull Request (PR)**.
5. Wait for the **Hrv Clan Bot** to check. If valid, we will review your PR within 24-48 hours!

## 🌍 List of Supported Domains
Currently, **Hrv Clan** supports registration under the following domains:

| Primary Domain | Target Audience | Status |
| :--- | :--- | :--- |
| `is-a-dev.indevs.in` | For Developers | ✅ Active |
| `is-a-app.indevs.in` | For Applications/Web Apps | ✅ Active |

## 📄 Sample JSON File Structure
```json
{
"owner": {
"username": "github-username",
"email": "example@example.com"
},
"domain": "is-a-dev.indevs.in",
"subdomain": "your-name",
"records": {
"CNAME": "username.github.io"
},
"proxied": false
}
```
📋 Supported Records. You can use these record types in the "records" section:
| Type | Description | Example Format |
|---|---|---|
| A | Points to IPv4 address | "A": ["1.1.1.1", "1.0.0.1"] |
| AAAA | Points to IPv6 address | "AAAA": ["2606:4700:4700::1111"] |
| CNAME | Points to another domain | "CNAME": "yourname.github.io" |
| MX | Mail Server Configuration | "MX": ["mx1.example.com", "mx2.example.com"] |
| TXT | Text Record (Verification...) | "TXT": ["v=spf1 include:_spf.example.com ~all"] |
| NS | NameServer Authorization | "NS": ["ns1.example.com", "ns2.example.com"] |

⚠️ Important Technical Note:
* NS Rule (Extremely Important): If you use NS records, you MUST NOT add any other record types (A, CNAME, TXT...) in the same file. NS will take control of the entire DNS of that subdomain.
* CNAME Conflict: Do not use CNAME records with A or AAAA records on the same subdomain.
* Public Email: Your email in the JSON file will be publicly visible on GitHub.
* 
🤖 Support & Reporting
* Bug Checking: If the Bot reports an error, click the Details button in the Pull Request to see troubleshooting instructions.
* Report Abuse: Please contact us via Email: abuse@hungrerovn.is-a.dev
* General Support: help@hungrerovn.is-a.dev
---,

const test = require("ava");
const fs = require("fs-extra");
const path = require("path");

const proxyableRecords = ["A", "AAAA", "CAA", "CNAME", "MX", "NS", "SRV"];
const domainsPath = path.resolve("domains");
const files = fs.readdirSync(domainsPath).filter(f => f.endsWith(".json"));

test("Cloudflare Proxy Configuration Validation", (t) => {
    if (files.length === 0) {
        t.pass("No domain files found.");
        return;
    }

    files.forEach((file) => {
        const data = fs.readJsonSync(path.join(domainsPath, file));
        
        if (data.proxied === true) {
            const recordKeys = Object.keys(data.record || {});
            
            // 1. Check if there is at least one proxyable record
            const hasProxyable = recordKeys.some(key => proxyableRecords.includes(key));
            t.true(hasProxyable, `${file}: Proxy is enabled but no proxyable records (A, CNAME, etc.) were found.`);

            // 2. Cloudflare cannot proxy TXT records
            if (recordKeys.includes("TXT")) {
                t.pass(`${file}: Note - TXT records will remain unproxied by Cloudflare.`);
            }
        } else {
            // Ensure AVA doesn't complain about "No assertions" when proxy is off
            t.pass();
        }
    });
});

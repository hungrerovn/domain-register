const test = require("ava");
const fs = require("fs-extra");
const path = require("path");

const validRecordTypes = ["A", "AAAA", "CAA", "CNAME", "MX", "NS", "SPF", "SRV", "TXT"];
const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
const hostnameRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}$/;

const domainsPath = path.resolve("domains");
const files = fs.readdirSync(domainsPath).filter(f => f.endsWith(".json"));

test("Strict DNS Record Validation", (t) => {
    if (files.length === 0) return t.pass();

    files.forEach((file) => {
        const data = fs.readJsonSync(path.join(domainsPath, file));
        const records = data.record || {};
        const keys = Object.keys(records);

        // --- 1. CNAME CO-EXISTENCE CHECK (The most important rule) ---
        if (keys.includes("CNAME")) {
            if (keys.length > 1) {
                t.fail(`${file}: CNAME record cannot exist alongside other records (${keys.filter(k => k !== 'CNAME').join(', ')}).`);
            }
        }

        // --- 2. ARRAY VALIDATION FOR MULTIPLE RECORDS ---
        keys.forEach((key) => {
            const val = records[key];
            if (["A", "AAAA", "MX", "NS", "TXT"].includes(key)) {
                t.true(Array.isArray(val), `${file}: ${key} must be an array.`);
                
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        if (key === "A") t.regex(v, ipv4Regex, `${file}: Invalid IPv4.`);
                        if (key === "MX" || key === "NS") t.regex(v, hostnameRegex, `${file}: Invalid Hostname.`);
                        if (key === "TXT") t.is(typeof v, "string", `${file}: TXT must be string.`);
                    });
                }
            }

            if (key === "CNAME") {
                t.is(typeof val, "string", `${file}: CNAME must be a single string.`);
                t.regex(val, hostnameRegex, `${file}: Invalid CNAME destination.`);
            }
        });
    });
    t.pass();
});

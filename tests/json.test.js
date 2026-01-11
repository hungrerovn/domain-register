const test = require("ava");
const fs = require("fs-extra");
const path = require("path");

const domainsPath = path.resolve("domains");
const files = fs.readdirSync(domainsPath).filter(f => f.endsWith(".json"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validRootDomains = ["is-a-dev.indevs.in", "is-a-app.indevs.in"];

test("JSON Consistency and Structure Validation", (t) => {
    if (files.length === 0) {
        t.pass("No domain files found.");
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(domainsPath, file);
        let data;

        // 1. Validate JSON Syntax
        try {
            data = fs.readJsonSync(filePath);
        } catch (err) {
            t.fail(`${file}: Invalid JSON syntax. Please check for missing commas or brackets.`);
            return;
        }

        // 2. Validate Filename vs Subdomain Logic
        // Example: "test.json" -> expected subdomain is "test"
        const expectedSubdomain = file.replace(/\.json$/, "");
        t.is(data.subdomain, expectedSubdomain, 
            `${file}: The 'subdomain' field ("${data.subdomain}") must match the filename ("${expectedSubdomain}").`
        );

        // 3. Validate Owner Information
        t.truthy(data.owner, `${file}: Missing 'owner' object.`);
        if (data.owner) {
            t.truthy(data.owner.username, `${file}: 'owner.username' is required.`);
            t.regex(data.owner.email || "", emailRegex, `${file}: 'owner.email' has an invalid format.`);
        }

        // 4. Validate Root Domain
        t.true(validRootDomains.includes(data.domain), 
            `${file}: '${data.domain}' is not a valid root domain. Use: ${validRootDomains.join(" or ")}`
        );

        // 5. Validate Data Types
        if (data.hasOwnProperty("proxied")) {
            t.is(typeof data.proxied, "boolean", `${file}: 'proxied' must be a boolean (true/false).`);
        }
    });

    t.pass();
});

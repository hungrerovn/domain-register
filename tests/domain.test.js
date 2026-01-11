const test = require("ava");
const fs = require("fs-extra");
const path = require("path");

const domainsPath = path.resolve("domains");
const files = fs.readdirSync(domainsPath).filter(f => f.endsWith(".json"));
const rootDomains = ["is-a-dev.indevs.in", "is-a-app.indevs.in"];

test("Subdomain Hierarchy and Technical Validation", (t) => {
    if (files.length === 0) return t.pass();

    files.forEach((file) => {
        const subdomain = file.replace(/\.json$/, "");
        const parts = subdomain.split(".");

        // Check for nested subdomains (more than 3 parts like: sub.user.is-a-dev.indevs.in)
        if (parts.length > 3) {
            const parentSubdomain = parts.slice(-3).join(".");
            
            // If the parent is not one of our root domains, it must have its own JSON file
            if (!rootDomains.includes(parentSubdomain)) {
                const parentFile = `${parentSubdomain}.json`;
                
                // Requirement 1: Parent file must exist in the domains/ folder
                t.true(files.includes(parentFile), `${file}: Parent domain '${parentFile}' must be registered first.`);
                
                // Requirement 2: Parent must not have NS records (Delegation check)
                const parentPath = path.join(domainsPath, parentFile);
                if (fs.existsSync(parentPath)) {
                    const parentData = fs.readJsonSync(parentPath);
                    if (parentData.record && parentData.record.NS) {
                        t.fail(`${file}: Parent '${parentSubdomain}' uses NS records. Please manage subdomains through their DNS provider.`);
                    }
                }
            }
        }
    });
    t.pass();
});

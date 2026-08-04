// @ts-nocheck
// Generates the ToolifyHQ license pack delivered inside every tool ZIP.

const BRAND = "TOOLIFYHQ";
const BRAND_NAME = "ToolifyHQ";
const SITE = "https://toofixit.lovable.app";
const ACTIVATE_URL = `${SITE}/activate`;
const SUPPORT_EMAIL = "smithmove0@gmail.com";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const ALPHA = UPPER + UPPER.toLowerCase() + DIGITS;
const SPECIAL = "!@#$%^&*()-_=+";

function pick(pool: string, n: number) {
  let out = "";
  for (let i = 0; i < n; i++) out += pool[Math.floor(Math.random() * pool.length)];
  return out;
}

export function abbreviate(toolName: string): string {
  const words = toolName.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  let abbr = words.map((w) => w[0].toUpperCase()).join("").slice(0, 4);
  if (abbr.length < 3) abbr = (abbr + toolName.replace(/[^A-Za-z]/g, "").toUpperCase()).slice(0, 3);
  return abbr.padEnd(3, "X");
}

export function licenseKey(abbr: string) {
  return `${abbr}-V${100 + Math.floor(Math.random() * 900)}-${pick(UPPER + DIGITS, 4)}-${pick(UPPER + DIGITS, 4)}-${1000 + Math.floor(Math.random() * 9000)}`;
}

export function licenseNumber() {
  return pick(UPPER + DIGITS, 16);
}

export function activationCode(sectionLength = 16, sections = 8) {
  const parts: string[] = [];
  for (let i = 0; i < sections; i++) parts.push(pick(ALPHA + SPECIAL, sectionLength));
  return parts.join("-");
}

export interface LicenseSet {
  license_key: string;
  license_number: string;
  activation_code: string;
}

export function generateLicenseSets(abbr: string, total = 10): LicenseSet[] {
  return Array.from({ length: total }, () => ({
    license_key: licenseKey(abbr),
    license_number: licenseNumber(),
    activation_code: activationCode(),
  }));
}

function fileBase(toolName: string) {
  return toolName.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function buildGeneratorScript(toolName: string, abbr: string): string {
  return `import random
import string
from pathlib import Path


PRODUCT_NAME = "${toolName}"
PRODUCT_ABBREVIATION = "${abbr}"


def generate_license_key() -> str:
    version = f"V{random.randint(100, 999)}"
    segment_one = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    segment_two = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    ending = str(random.randint(1000, 9999))
    return f"{PRODUCT_ABBREVIATION}-{version}-{segment_one}-{segment_two}-{ending}"


def generate_license_number() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=16))


def generate_activation_code(section_length: int = 16, sections: int = 8) -> str:
    allowed = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    parts = []
    for _ in range(sections):
        part = "".join(random.choices(allowed, k=section_length))
        parts.append(part)
    return "-".join(parts)


def generate_license_set() -> dict:
    return {
        "product_name": PRODUCT_NAME,
        "license_key": generate_license_key(),
        "license_number": generate_license_number(),
        "activation_code": generate_activation_code(),
    }


def save_credentials(filename: str = None, total_codes: int = 10) -> Path:
    if filename is None:
        filename = PRODUCT_NAME.replace(" ", "_").replace("/", "_") + "_license_credentials.txt"

    output_path = Path(filename)
    with output_path.open("w", encoding="utf-8") as file:
        file.write("${BRAND} PRODUCT LICENSE FILE\\n")
        file.write("==============================\\n\\n")
        file.write(f"Product Name: {PRODUCT_NAME}\\n")
        file.write("Activation URL:\\n")
        file.write("${ACTIVATE_URL}\\n\\n")
        file.write("Activation Input:\\n")
        file.write("1. Store URL\\n")
        file.write("2. License Key\\n")
        file.write("3. License Number\\n")
        file.write("4. Activation Code\\n\\n")
        file.write("LICENSE CREDENTIALS:\\n\\n")

        for index in range(1, total_codes + 1):
            license_set = generate_license_set()
            file.write(f"License Set {index}\\n")
            file.write(f"License Key: {license_set['license_key']}\\n")
            file.write(f"License Number: {license_set['license_number']}\\n")
            file.write(f"Activation Code: {license_set['activation_code']}\\n\\n")

    return output_path


if __name__ == "__main__":
    saved_file = save_credentials(total_codes=10)
    print(f"License credentials saved to: {saved_file.resolve()}")
`;
}

export function buildLicensesFile(toolName: string, sets: LicenseSet[]): string {
  let out =
    `${BRAND} PRODUCT LICENSE FILE\n` +
    `==============================\n\n` +
    `Product Name: ${toolName}\n` +
    `Activation URL:\n${ACTIVATE_URL}\n\n` +
    `Activation Input:\n1. Store URL\n2. License Key\n3. License Number\n4. Activation Code\n\n` +
    `LICENSE CREDENTIALS:\n\n`;
  sets.forEach((s, i) => {
    out += `License Set ${i + 1}\n`;
    out += `License Key: ${s.license_key}\n`;
    out += `License Number: ${s.license_number}\n`;
    out += `Activation Code: ${s.activation_code}\n\n`;
  });
  return out;
}

export function buildInstructionsFile(toolName: string, sample: LicenseSet): string {
  return `IMPORTANT NOTICE:

This document contains highly sensitive license information for the product: ${toolName}.
Unauthorized distribution, duplication, or misuse of this file is strictly prohibited and may result in legal action.

INSTRUCTIONS FOR ACTIVATION:

1. Secure Handling:
   - Only an experienced software developer or IT specialist should handle this activation process.
   - Do NOT share this file with unauthorized personnel.
   - The license credentials provided for this product are generated exclusively for the original purchaser.
   - Any attempt to reuse, replicate, or redistribute these credentials is prohibited.

2. Activation Process:
   a. Visit the official activation portal: ${ACTIVATE_URL}
   b. Log in using your registered ${BRAND_NAME} account. If you do not have an account, create one using verified credentials.
   c. Ensure a secure and stable internet connection before starting the activation process.
   d. Keep this document open in a secure environment while activating the product.

3. Input Requirements:
   - You will be prompted to enter the following values:
     i. Store URL: Your full Shopify store URL.
     ii. License Key: The product-specific key supplied in the license file.
     iii. License Number: A 16-character alphanumeric identifier.
     iv. Activation Code: A complex multi-segmented string.

4. Activation Procedure:
   - Copy and paste the Store URL, License Key, License Number, and Activation Code directly from the license file to avoid errors.
   - Confirm all values are entered exactly as shown, with no extra spaces or missing characters.
   - Click "Activate" to initiate the verification process.
   - If the activation fails, recheck all entered values carefully and try again once.

5. Critical Warning:
   - Each license number and activation code pair is unique to ${toolName}.
   - Any attempt to reuse a previously activated code may result in permanent deactivation.
   - Repeated failed attempts may trigger the system's security protocols and temporarily block the activation request.

6. Post-Activation:
   - Once successfully activated, store this file in an encrypted or secure location.
   - Maintain a backup of the activation confirmation for future verification.
   - Do not share activated credentials with third parties or unverified developers.

SAMPLE PRODUCT DETAILS:
- Product Name: ${toolName}
- Sample License Key: ${sample.license_key}
- Sample License Number: ${sample.license_number}
- Sample Activation Code: ${sample.activation_code}

SUPPORT AND CONTACT:
- If you encounter any issues, contact the technical support team at ${SUPPORT_EMAIL}.
- Always include your registered email, product name, license key, license number, and a detailed description of the issue.

DISCLAIMER:
${BRAND_NAME} is not responsible for any issues arising from improper use, sharing, duplication, or mismanagement of the license credentials.
Please adhere strictly to the above guidelines.
`;
}

export function buildLicensePack(toolName: string, forcedKey?: string): Record<string, string> {
  const abbr = abbreviate(toolName);
  const base = fileBase(toolName);
  const sets = generateLicenseSets(abbr, 10);
  if (forcedKey) sets[0].license_key = forcedKey;
  const files: Record<string, string> = {};
  files[`${base}_license_generator.py`] = buildGeneratorScript(toolName, abbr);
  files[`${base}_LICENSES.txt`] = buildLicensesFile(toolName, sets);
  files[`${base}_INSTRUCTIONS.txt`] = buildInstructionsFile(toolName, sets[0]);
  return files;
}

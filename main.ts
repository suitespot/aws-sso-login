import { readAwsSsoConfig } from "./read-aws-config.ts";
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { execAwsSsoLogin } from "./exec-aws-sso-login.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const configs = await readAwsSsoConfig();

  const selectedProfile = await Select.prompt({
    message: "Select a profile",
    options: configs.map((config) => config.profile),
  });

  await execAwsSsoLogin(selectedProfile);

}

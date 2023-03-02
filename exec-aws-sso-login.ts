export async function execAwsSsoLogin(profile: string) {
  const process = Deno.run({
    cmd: [
      "aws",
      "sso",
      "login",
      "--profile",
      profile,
      "--no-cli-pager",
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const res = await process.status();

  if (!res.success) {
    const rawError = await process.stderrOutput();
    throw new Error(new TextDecoder().decode(rawError));
  }
  // log stdout 
  const rawOutput = await process.output();
  console.log(new TextDecoder().decode(rawOutput));
  console.log(`\n\n`)
  console.log(`export AWS_PROFILE=${profile}`);
  console.log(`aws s3 ls --profile=${profile}`);
}

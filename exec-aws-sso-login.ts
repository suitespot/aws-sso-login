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
    stdout: 'inherit',
    stderr: "piped",
  });

  const res = await process.status();

  if (!res.success) {
    const rawError = await process.stderrOutput();
    throw new Error(new TextDecoder().decode(rawError));
  }

  console.log(`------------------`);
  console.log(`export AWS_PROFILE=${profile}`);
  console.log(`aws s3 ls --profile=${profile}`);
}

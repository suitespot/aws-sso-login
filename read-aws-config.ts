export interface AwsConfig {
  profile: string;
  ssoStartUrl: string;
  ssoRegion: string;
  ssoAccountId: string;
  ssoRoleName: string;
  region?: string;
  output?: 'json' | 'text' | 'table';
}

export async function readAwsSsoConfig(): Promise<AwsConfig[]> {
  // $HOME/.aws/config
  const fileData = await Deno.readTextFile(Deno.env.get('HOME') + '/.aws/config')
  const profileDatas = fileData.split('[profile ');
  const configs: AwsConfig[] = [];
  for (const profileData of profileDatas) {
    const config: Partial<AwsConfig> = {};
    const [profileLine, ...lines] = profileData.split(/\r?\n/);
    const profile = profileLine.substring(0, profileLine.length - 1);
    config.profile = profile;
    for (const line of lines) {
      const [key, value] = line.split(/\s*=\s*/);
      if (!key || !value) {
        continue;
      }
      const camelCaseKey = toCamelCase(key);
      (config as any)[camelCaseKey] = value;
    }
    configs.push(config as AwsConfig);
  }
  return configs;
}

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

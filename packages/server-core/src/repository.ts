/**
 * 仓库归属与派生地址。
 *
 * 放在 server-core：Worker（新版本检测）与管理端（页头 Logo、发布页链接）
 * 都要用，两边各自写一份字符串迟早会漂移。
 */

/** 默认仓库归属（owner/repo），fork 后可经环境变量 REPOSITORY_SLUG 覆盖 */
export const DEFAULT_REPOSITORY_SLUG = "G1oow/SubBoost-Worker-Lite";

/**
 * 解析当前仓库归属。
 *
 * 优先级：`__REPOSITORY_SLUG__` 全局字面量（由构建工具的 define 在打包期注入，
 * Vite: worker/ui/vite.config.ts）> 环境变量 `process.env.REPOSITORY_SLUG`
 * （Worker 运行时与本地脚本）> 常量默认值。
 * 这样在 fork 里只需设一个变量，页头 Logo 跳转、发布页入口与新版本检测
 * 就会指向 fork 自身，不必改代码。
 */
declare const __REPOSITORY_SLUG__: string | undefined;

export function resolveRepositorySlug(): string {
  const fromDefine =
    typeof __REPOSITORY_SLUG__ === "string" ? __REPOSITORY_SLUG__.trim() : "";
  if (fromDefine && /^[\w.-]+\/[\w.-]+$/.test(fromDefine)) return fromDefine;
  const fromEnv = globalThis.process?.env?.REPOSITORY_SLUG?.trim();
  if (fromEnv && /^[\w.-]+\/[\w.-]+$/.test(fromEnv)) return fromEnv;
  return DEFAULT_REPOSITORY_SLUG;
}

/** 仓库归属（owner/repo） */
export const REPOSITORY_SLUG = resolveRepositorySlug();

/** 仓库主页 */
export const REPOSITORY_URL = `https://github.com/${REPOSITORY_SLUG}`;

/** 发布页：管理端「前往 GitHub」按钮指向这里 */
export const REPOSITORY_RELEASES_URL = `${REPOSITORY_URL}/releases`;

/**
 * 上游版本号的唯一来源：主干分支的 package.json。
 *
 * 不用 GitHub API 有两个原因：一是未认证的 API 每小时只有 60 次配额，
 * 而 Workers 出口 IP 是共享的，很容易撞上 403；二是本仓库的版本号在
 * 每次改动时都会随提交升上去，读 package.json 拿到的就是最新版本。
 */
export const UPSTREAM_PACKAGE_JSON_URL = `https://raw.githubusercontent.com/${REPOSITORY_SLUG}/main/package.json`;

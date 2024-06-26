/**
 * 获取依赖文件路径
 * */
export async function resourcesPathGet(
  type: 'platform' | 'inside' | 'extern' | 'root',
  path?: string
): Promise<string> {
  return await window.resources.pathGet(type, path);
}

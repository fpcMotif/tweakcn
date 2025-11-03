想临时跳过类型检查，有三种最简单的办法：

- 最快（仅跳过本次提交所有钩子）
  ```bash
  git commit -m "temp skip typecheck" --no-verify
  ```

- 仅这次禁用 Husky（PowerShell）
  ```powershell
  $env:HUSKY=0; git commit -m "temp skip typecheck"; Remove-Item Env:HUSKY
  ```

- 暂时移除 lint-staged 的 typecheck（提交后记得改回）
  1) 打开 `package.json` → `lint-staged`，删除 `bun run typecheck` 那一行  
  2) 提交完再加回去

提示：以上只是在本地跳过；如果 CI 里还有类型检查，CI 仍会失败。需要时我可以帮你加一个可控开关（环境变量）让 lint-staged 仅在需要时才跑 typecheck。
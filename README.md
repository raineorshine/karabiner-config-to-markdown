# karabiner-config-to-markdown

Convert a [Karabiner](https://karabiner-elements.pqrs.org) config to markdown. A simple way to publish your custom key bindings.

## Install

```sh
npm install -g karabiner-config-to-markdown
```

## Usage

### CLI

```sh
# read ~/.config/karabiner/karabiner.json
karabiner-config-to-markdown

# or pass path to config file
karabiner-config-to-markdown myconfig.json
```

### Module

```js
const fs = require('fs')
const karabinerConfigToMarkdown = require('karabiner-config-to-markdown')
const config = fs.readFileSync('~/.config/karabiner/karabiner.json', 'utf-8')
console.log(karabinerConfigToMarkdown(config))
```

## Example

### Input:

`~/.config/karabiner/karabiner.json`

```js
{
  ...
  "rules": [
    {
      "description": "Backtick: Option + Quote",
      "manipulators": [
        {
          "from": {
            "key_code": "quote",
            "modifiers": {
              "mandatory": [
                "left_option"
              ]
            }
          },
          "to": [
            {
              "key_code": "grave_accent_and_tilde"
            }
          ],
          "type": "basic"
        }
      ]
    },
    {
      "description": "Launch apps: Right shift + letters",
      "manipulators": [
        {
          "from": {
            "key_code": "t",
            "modifiers": {
              "mandatory": [
                "right_shift"
              ]
            }
          },
          "to": [
            {
              "shell_command": "open '/Applications/Sublime Text.app'"
            }
          ],
          "type": "basic"
        }
      ]
    }
  ]
}
```

### Output:

- Backtick: Option + Quote
  - L-Option + `'` → `` ` ``
- Launch apps: Right shift + letters
  - R-Shift + `t` → `open '/Applications/Sublime Text.app'`

# combo player

**compo player** is visualizer app of [combo script](https://github.com/tategakibunko/combo-script), supports standard button names and stick operation(Playstaion, Xbox), and plugin feature is also supported.

## Usage

```typescript
import { ComboPlayer } from 'combo-player';

const player = new ComboPlayer();
player.play("rotateL(90, 0), triangle"); // Hadou-ken!(波動拳)
```

## Command examples by combo-script

### Konami command(コナミコマンド)

```
up, up, down, down, left, right, left, right, A, B
```

### StreetFighter, Sho-ryu-ken(昇龍拳)

By cross key.

```
right, down, (right, down), punch
```

By stick key.

```
set(0), move(0, 90), rotate(90, 45), punch
```

### Tekken, Tetsu-zan-kou(鉄山靠) 

```
down, (action-up, action-right)
```

In PS4,

```
down, (triangle, circle)
```

In Xbox,

```
down, (Y, B)
```

### Loop shoot(PES2020 or Winning Eleven 2020)

```
L1 { square }
```

It means "while holding down `L1`, push `square`".


## Supported buttons

All buttons are **case insensitive**.

So you can write both `UP` and `up`.

### Cross keys

- `up`
- `right`
- `down`
- `left`

### Main action buttons

Generally, main action buttons are places at **right** side of game-pad.

In Playstation, it's `triangle`, `circle`, `cross`, `square`.
In Xbox, it's `y`, `b`, `a`, `x`.

- `action-up` (or `triangle`, `y`)
- `action-right` (or `circle`, `b`)
- `action-down` (or `cross`, `a`)
- `action-left` (or `square`, `x`)

### Option buttons

- `L1`
- `L2`
- `L3` (left stick push)
- `R1`
- `R2`
- `R3` (right stick push)

### Helper message

You can show some helper message at log area by enclosing text with `"`~`"`.

```
"Input quickly!" L1 { circle, cross }
```

Or you can use `info`, `warn`, `error` function.

```
info("this is info"), warn("this is warning"), error("this is error")
```

## Supported functions

About these functions, see [combo-script](https://github.com/tategakibunko/combo-script).

- `rotate`, `rotateL`, `rotateR`
- `set`, `setL`, `setR`
- `unset`, `unsetL`, `unsetR`
- `move`, `moveL`, `moveR`
- `touch`, `touchL`, `touchR`

## Plugin

You can add plugin function.

```typescript
import { ComboPlayer, PluginContext } from 'combo-player';

const player = new ComboPlayer();

// In this example, we just join arguments and display it.
player.addPlugin("join", {
  // called from normal sequence
  // [example] a, b, join("this", "is", "it!")
  onAction: (ctx: PluginContext): Promise<any> => {
    return ctx.player.visitText(ctx.args.join(" "), "info", ctx.actionContext);
  },
  // called when plugin function is called as holding start action.
  // [example] a, b, join("this", "is", "holding", "action!"){ x, y }
  onHoldStart: (ctx: PluginContext): Promise<any> => {
    return ctx.player.visitText(ctx.args.join(" "), "info", ctx.actionContext);
  },
  // called when holding action is finished.
  // [example] join("foo"){ a, b }, "after holding"
  onHoldEnd: (ctx: PluginContext): Promise<any> => {
    return Promise.resolve();
  }
}
```

## License

MIT

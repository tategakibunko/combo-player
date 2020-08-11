import { GameEntry, GameCommand } from './types';
import { ComboPlayer } from './combo-player';
import { PluginEntries } from './plugins';
import { Menu } from './menu';
import { CsGameLoader } from './game-loader';
import { ShakeElement } from './effect';
import { CsEffectEnv } from './effect-env';

window.addEventListener("load", async () => {
  const playCombo = document.getElementById("play-combo") as HTMLElement;
  const selectCode = document.getElementById("combo-script") as HTMLSelectElement;
  const codePreview = document.getElementById("script-code") as HTMLTextAreaElement;
  const gameLoader = new CsGameLoader();
  const player = new ComboPlayer();

  const updateCodePreview = (code: string) => {
    // codePreview.innerHTML = code;
    codePreview.value = code;
  }

  const sortGameCommand = (cmd1: GameCommand, cmd2: GameCommand): number => {
    const c1 = cmd1.category || "";
    const c2 = cmd2.category || "";
    const n1 = cmd1.name;
    const n2 = cmd2.name;
    if (c1 < c2) {
      return -1;
    }
    if (c1 === c2) {
      return (n1 < n2) ? -1 : (n1 === n2) ? 0 : 1;
    }
    return 1;
  }

  const updateGame = async (game: GameEntry, sort = false) => {
    selectCode.innerHTML = "";
    const commands = sort ? game.commands.sort(sortGameCommand) : game.commands;
    commands.forEach(cmd => {
      const opt = document.createElement("option");
      const cmdName = cmd.category ? `${cmd.category} / ${cmd.name}` : cmd.name;
      opt.value = cmd.combo;
      opt.innerHTML = cmdName;
      selectCode.appendChild(opt);
    });
    updateCodePreview(game.commands[0].combo);
    await Promise.all([
      new ShakeElement(selectCode, CsEffectEnv).exec(),
      new ShakeElement(codePreview, CsEffectEnv).exec(),
    ]);
  }

  document.querySelectorAll(".speed-rate input[name=speed-rate]").forEach(input => {
    const radio = input as HTMLInputElement;
    radio.onchange = (e) => {
      player.setSpeed(parseFloat(radio.value));
    }
  });

  document.querySelectorAll(".game-item").forEach(item => {
    const link = item as HTMLLinkElement;
    link.onclick = async (e) => {
      const gameId = link.dataset.gameId || "";
      const game = await gameLoader.load(gameId);
      if (game) {
        updateGame(game);
      }
    }
  });

  selectCode.onchange = (e) => {
    updateCodePreview(selectCode.value);
  }

  playCombo.onclick = async () => {
    player.reset();
    await player.play(codePreview.value);
    // await player.play(selectCode.value);
  }

  PluginEntries.forEach(entry => player.addPlugin(entry.name, entry.plugin));
  new Menu().setup();

  updateGame(await gameLoader.load());
});


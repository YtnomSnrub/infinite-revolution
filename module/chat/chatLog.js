import { RollHelper } from "./rollHelper.js";

export class ChatLogIR extends ChatLog {
  _getEntryContextOptions() {
    const options = super._getEntryContextOptions();
    options.push(
      {
        name: "IR.RerollMenu.AddDie",
        icon: '<i class="fas fa-plus"></i>',
        condition: $li => {
          const message = game.messages.get($li.attr("data-message-id") ?? "", { strict: true });
          const roll = message.isRoll ? message.roll : null;
          return roll;
        },
        callback: async li => {
          const message = game.messages.get(li.data("messageId"));
          const roll = message.roll;
          roll._evaluated = false;

          const dialogHtml = await renderTemplate("systems/infinite-revolution/templates/dialogs/dialog-add-die.html");
          const newFaceValue = await new Promise(resolve => {
            new Dialog({
              title: game.i18n.localize("IR.RerollMenu.AddDie"),
              content: dialogHtml,
              buttons: {
                add: {
                  label: game.i18n.localize("IR.RerollMenu.AddDie"),
                  callback: html => resolve(Number.parseInt(html[0].querySelector("form")["die-value"].value, 10))
                }
              },
              default: "add",
              close: () => resolve(null)
            }, { width: 240 }).render(true);
          });

          if (newFaceValue === null) {
            return;
          }

          const oldNumbers = {};
          roll.dice.forEach((x, i) => {
            oldNumbers[i] = x.number;
            const results = x.results;
            if (results.length > 0) {
              // Don't reroll existing dice
              x.results.forEach(r => r.hidden = true);

              // Roll the new dice
              x.number = 1;
              if (newFaceValue) {
                x.results.push(({ result: newFaceValue, active: true }));
                x.number = 0;
              }

              x._evaluated = false;
            }
          });

          // Evaluate new roll
          await roll.evaluate({ async: true });
          // Adjust numbers to match previous roll
          roll._evaluated = false;
          roll.dice.forEach((x, i) => {
            x.number = oldNumbers[i] + 1;
          });

          const content = new DOMParser().parseFromString(message.data.content, "text/html");
          const resultData = content.querySelector(".result-data");
          if (resultData) content.body.removeChild(resultData);

          await message.delete({ render: false });
          RollHelper.createCheckRoll(roll, message.data.flavor, content.body.innerHTML);
        }
      },
      {
        name: "IR.RerollMenu.RemoveDie",
        icon: '<i class="fas fa-minus"></i>',
        condition: $li => {
          const message = game.messages.get($li.attr("data-message-id") ?? "", { strict: true });
          const roll = message.isRoll ? message.roll : null;
          return roll;
        },
        callback: async li => {
          const message = game.messages.get(li.data("messageId"));
          const roll = message.roll;
          roll._evaluated = false;

          const dialogHtml = await renderTemplate("systems/infinite-revolution/templates/dialogs/dialog-remove-die.html");
          const removeFaceValue = await new Promise(resolve => {
            new Dialog({
              title: game.i18n.localize("IR.RerollMenu.RemoveDie"),
              content: dialogHtml,
              buttons: {
                remove: {
                  label: game.i18n.localize("IR.RerollMenu.RemoveDie"),
                  callback: html => resolve(Number.parseInt(html[0].querySelector("form")["die-value"].value, 10))
                }
              },
              default: "remove",
              close: () => resolve(null)
            }, { width: 240 }).render(true);
          });

          if (removeFaceValue === null || removeFaceValue < 1 || removeFaceValue > 6) {
            return;
          }

          const oldNumbers = {};
          roll.dice.forEach((x, i) => {
            oldNumbers[i] = x.number;
            const results = x.results;
            if (results.length > 0) {
              // Remove the marked dice value
              const lowestIndex = x.results.findIndex(x => x.result === removeFaceValue && x.active !== false);
              if (lowestIndex >= 0) {
                x.results.splice(lowestIndex, 1);

                // Don't reroll existing dice
                x.results.forEach(r => r.hidden = true);

                // Roll the new dice
                x.number = 0;
                x._evaluated = false;
              }
            }
          });

          // Evaluate new roll
          await roll.evaluate({ async: true });
          // Adjust numbers to match previous roll
          roll._evaluated = false;
          roll.dice.forEach((x, i) => {
            x.number = oldNumbers[i] - 1;
          });

          const content = new DOMParser().parseFromString(message.data.content, "text/html");
          content.body.removeChild(content.querySelector(".result-data"));

          await message.delete({ render: false });
          RollHelper.createCheckRoll(roll, message.data.flavor, content.body.innerHTML);
        }
      },
      {
        name: "IR.RerollMenu.RerollLowest",
        icon: '<i class="fas fa-dice-d6"></i>',
        condition: $li => {
          const message = game.messages.get($li.attr("data-message-id") ?? "", { strict: true });
          const $content = $(message.data.flavor);

          const roll = message.isRoll ? message.roll : null;
          return ["attack", "attribute"].includes($content.data("action")) && roll;
        },
        callback: async li => {
          const message = game.messages.get(li.data("messageId"));
          const roll = message.roll;
          roll._evaluated = false;

          const oldNumbers = {};
          roll.dice.forEach((x, i) => {
            oldNumbers[i] = x.number;
            const results = x.results;
            if (results.length > 0) {
              // Mark the lowest dice as rerolled
              const resultValues = results.filter(x => x.active !== false).map(x => x.result);
              const lowestValue = Math.min(...resultValues);
              const lowestIndex = x.results.findIndex(x => x.result === lowestValue && x.active !== false);
              x.results[lowestIndex].active = false;
              x.results[lowestIndex].rerolled = true;

              // Don't reroll existing dice
              x.results.forEach(r => r.hidden = true);

              // Roll the new dice
              x.number = 1;
              x._evaluated = false;
            }
          });

          // Evaluate new roll
          await roll.evaluate({ async: true });
          // Adjust numbers to match previous roll
          roll._evaluated = false;
          roll.dice.forEach((x, i) => {
            x.number = oldNumbers[i];
          });

          const content = new DOMParser().parseFromString(message.data.content, "text/html");
          content.body.removeChild(content.querySelector(".result-data"));

          await message.delete({ render: false });
          RollHelper.createCheckRoll(roll, message.data.flavor, content.body.innerHTML);
        }
      }
    );

    return options;
  }
}

import { RollHelper } from "./rollHelper.js";

export class ChatLogIR extends ChatLog {
    _getEntryContextOptions() {
        const options = super._getEntryContextOptions();
        options.push(
            {
                name: "IR.RerollMenu.RerollLowest",
                icon: '<i class="fas fa-dice-d6"></i>',
                condition: ($li) => {
                    const message = game.messages.get($li.attr("data-message-id") ?? "", { strict: true });
                    const $content = $(message.data.flavor);

                    const roll = message.isRoll ? message.roll : null;
                    return $content.data("action") === "attack" && roll;
                },
                callback: async (li) => {
                    const message = game.messages.get(li.data("messageId"));
                    const roll = message.roll;
                    roll._evaluated = false;

                    roll.dice.forEach(x => {
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

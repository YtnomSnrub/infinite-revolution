import { RollHelper } from "./rollHelper.js";

export class ChatLogIR extends ChatLog {
    _getEntryContextOptions() {
        const options = super._getEntryContextOptions();
        options.push(
            {
                name: "IR.RerollMenu.RerollLowest",
                icon: '<i class="fas fa-dice"></i>',
                callback: async (li) => {
                    const message = game.messages.get(li.data("messageId"));
                    const roll = message.roll;
                    roll._evaluated = false;

                    roll.dice.forEach(x => {
                        const results = x.results;
                        if (results.length > 0) {
                            const resultValues = results.filter(x => x.active !== false).map(x => x.result);
                            const lowestValue = Math.min(...resultValues);
                            console.log(x.results, lowestValue);
                            const lowestIndex = x.results.findIndex(x => x.result === lowestValue && x.active !== false);
                            x.results[lowestIndex].active = false;
                            x.results[lowestIndex].rerolled = true;
                        }

                        x.results.forEach(r => r.hidden = true);

                        x.number = 1;
                        x._evaluated = false;
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

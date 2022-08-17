export class RollHelper {
    static createCheckRoll(title, diceCount, rollData) {
        const r = new Roll(`${diceCount}d6`, rollData);
        r.evaluate({ async: true }).then(response => {
            const weakHits = response.dice[0].results.filter(x => x.result === 4 || x.result === 5).length;
            const strongHits = response.dice[0].results.filter(x => x.result === 6).length;

            let hitType = "Null";
            if (strongHits >= 2)
                hitType = "Critical Hit";
            else if (strongHits >= 1)
                hitType = "Strong Hit";
            else if (weakHits >= 1)
                hitType = "Weak Hit";

            response.toMessage({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: `<h2>${title}</h2><p>${hitType}</p>`
            }).then(x => {
                console.log(x);
            });
        });
    }
}

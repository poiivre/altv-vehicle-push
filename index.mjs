import * as alt from 'alt';

/* Only used if you activated the press E to push */

alt.onClient('seln:vehiclepush:getvehicleslist', (player) => {
    let list = alt.Vehicle.all;
    alt.emitClient(player, 'seln:vehiclepush:sendvehicleslist', list);
});

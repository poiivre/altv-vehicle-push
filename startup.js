import * as alt from 'alt';
import game from 'natives';
import * as native from 'natives';


let interval;
native.requestAnimDict('missfinale_c2ig_11');

let pushing = false;



/* Using Stuyk's Context Menu */ /*

alt.on('context:Ready', () => {
    alt.emit('context:CreateMenu', 'vehicle', 'Vehicle');
    alt.emit('context:AppendToMenu', 'vehicle', 'Push', 'seln:vehiclepush', false);
});

*/


/* Using press E near a car to push it */ 

alt.on('keydown', (key) => {
    if (!pushing) {

        // [E] 
        if ( key == 69 && !( native.isPedInAnyVehicle(alt.Player.local.scriptID, true) )) {
            alt.emitServer('seln:vehiclepush:getvehicleslist'); 
        }

    }
});

alt.onServer('seln:vehiclepush:sendvehicleslist', (list) => {

    let j = alt.Player.local.scriptID;
    let jcoords = native.getEntityCoords(j, true);

    list.forEach(veh => {
        if (veh.scriptID !=0) {
            let vehcoords = native.getEntityCoords(veh.scriptID)
            let dist = native.getDistanceBetweenCoords(jcoords.x, jcoords.y, jcoords.z, vehcoords.x, vehcoords.y, vehcoords.z, true);
            if (dist <= 3.0) {
                vehiclepush(veh.scriptID)
            }
        }
    });
});








// SCRIPT


alt.on('seln:vehiclepush', data => { vehiclepush(data.entity) } );

function vehiclepush(id) {
    
    

    let j = alt.Player.local.scriptID;
    let jcoords = native.getEntityCoords(j, true);
    let vehid = id;
    let bone = native.getPedBoneIndex(j, 6286);
    let vehcoords = native.getEntityCoords(vehid)

    let vehsize = native.getModelDimensions(native.getEntityModel(vehid), new alt.Vector3(0.0, 0.0, 0.0), new alt.Vector3(5.0, 5.0, 5.0) );
    let dist = native.getDistanceBetweenCoords(jcoords.x, jcoords.y, jcoords.z, vehcoords.x, vehcoords.y, vehcoords.z, true);

    if (( dist <= 8.0 ) && !( native.isPedInAnyVehicle(j, true) )) {


        let forward = native.getEntityForwardVector(vehid);
        

        //let firstpart = vehcoords + forward;
        let firstpart = new alt.Vector3( vehcoords.x + forward.x , vehcoords.y + forward.y, vehcoords.z + forward.z )
        let secondpart = new alt.Vector3( vehcoords.x + (forward.x )*-1, vehcoords.y + (forward.y)*-1, vehcoords.z + (forward.z)*-1 )

        let first = native.getDistanceBetweenCoords(firstpart.x, firstpart.y, firstpart.z, jcoords.x, jcoords.y, jcoords.z, true);
        let second = native.getDistanceBetweenCoords(secondpart.x, secondpart.y, secondpart.z, jcoords.x, jcoords.y, jcoords.z, true);

        let front;

        if ( first > second ) { front = false }
        else { front = true }

        if ( native.isVehicleSeatFree(vehid, -1) ) {
                
            //native.networkRequestControlOfEntity(vehid);


            if ( front ) {
                native.attachEntityToEntity(j, vehid, bone, 0.0, vehsize[1].y * -1 + 0.1, vehsize[1].z + 1.0, 0.0, 0.0, 180.0, 0.0, false, false, true, false, true);
            } else {
                native.attachEntityToEntity(j, vehid, bone, 0.0, vehsize[1].y - 0.3, vehsize[1].z + 1.0, 0.0, 0.0, 0.0, 0.0, false, false, true, false, true)
            }

        }

        native.requestAnimDict('missfinale_c2ig_11');
        let animstarted = false

        interval = alt.setInterval(() => {

            pushing = true

            if ( !native.isVehicleSeatFree(vehid, -1) ) {

                native.detachEntity(j, false, true);
                native.stopAnimTask(j, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 2.0);
                native.setEntityCollision(j, true, false);
                native.freezeEntityPosition(j, true);
                native.freezeEntityPosition(j, false);
                native.setVehicleOnGroundProperly(vehid, true);
                
                alt.clearInterval(interval);
                pushing = false
            }

            if( native.hasAnimDictLoaded('missfinale_c2ig_11') && !animstarted) {
                
                animstarted = true;
                native.taskPlayAnim(j, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 2.0, -8.0, -1, 35, 0, 0, 0, 0)

            } else if (animstarted) {


                // flying bug
                if (native.hasEntityCollidedWithAnything(vehid) ) {
                    native.setVehicleOnGroundProperly(vehid)
                }
                
                //forward
                if ( native.isControlPressed(0, 32) ) {
                    if (front) {
                        native.setVehicleForwardSpeed(vehid, -1.0)
                    } else {
                        native.setVehicleForwardSpeed(vehid, 1.0)
                    }
                    
                }

                //backward
                if ( native.isControlPressed(0, 8) ) {
                    if (!front) {
                        native.setVehicleForwardSpeed(vehid, -1.0)
                    } else {
                        native.setVehicleForwardSpeed(vehid, 1.0)
                    }
                }

                //left
                if ( native.isControlPressed(0, 34) ) {
                    if (front) {
                        native.taskVehicleTempAction(j, vehid, 10, 500);
                    } else {
                        native.taskVehicleTempAction(j, vehid, 11, 500);
                    }
                    
                }

                //right
                if ( native.isControlPressed(0, 9) ) {
                    if (!front) {
                        native.taskVehicleTempAction(j, vehid, 10, 500);
                    } else {
                        native.taskVehicleTempAction(j, vehid, 11, 500);
                    }
                }

                //x
                if ( native.isControlPressed(0, 73) ) {
                    native.detachEntity(j, false, true);
                    native.stopAnimTask(j, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 2.0);
                    native.setEntityCollision(j, true, false);
                    native.freezeEntityPosition(j, true);
                    native.freezeEntityPosition(j, false);
                    native.setVehicleOnGroundProperly(vehid, true);
                    alt.clearInterval(interval);
                    pushing = false
                }

            }

        }, 0);

    }
    
}

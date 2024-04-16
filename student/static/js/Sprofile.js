var state=false;
document.getElementById( "map_change").classList.add( "active" );

function change(){
    state=!state;
    if (state){
        document.getElementById( "map_change").classList.add( "active" );
    }else{
        document.getElementById("map_change").classList.remove("active");
    }
}
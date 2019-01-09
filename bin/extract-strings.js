var strings=[];

var idx=0;

$("#guide [translate]").each(
    function(){
        var id="home_guide_"+idx++;
        strings.push({
            id: id,
            translation: this.innerHTML
        });
        this.innerHTML='{{ safeHTML ( T "'+id+'" ) }}';
    }
);

console.log(JSON.stringify(strings));

console.log("HTML\n\n\n");

console.log($("#guide").innerHTML);
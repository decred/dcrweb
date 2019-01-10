var strings=[];

var idx=0;

$("[translate]").each(
    function(){
        var id="brand_guide_"+idx++;
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
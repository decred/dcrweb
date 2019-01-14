var strings=[];

var idx=0;

$("[translate]").each(
    function(){
        var origStr = this.innerHTML;
        var idPrefix = "matrix";

        var words = origStr.trim().split(/ +/).map(str => str.toLowerCase().replace(/\W/g, '')).slice(0, 5);

        id = idPrefix + "_" + words.join("_");

        strings.push({
            id: id,
            translation: origStr
        });
        // this.innerHTML='{{ safeHTML ( T "'+id+'" ) }}';
    }
);

console.log(JSON.stringify(strings));

// console.log("HTML\n\n\n");

// console.log($("#guide").innerHTML);
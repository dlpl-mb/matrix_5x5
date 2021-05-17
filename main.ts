// input.onButtonPressed(Button.A, function () {
//     showtext (0,"12",neopixel.colors(NeoPixelColors.Red),false)
// })
// input.onButtonPressed(Button.B, function () {
//     showtext (1,"23",neopixel.colors(NeoPixelColors.Blue),false)
// })



function set_system(sname: number) {
    //m_sname=sname
    if (sname == 0) {
        init_strip(0,2,1) //standard, 8x8,pin1 
        basic.showString("T")
    }

    if (sname == 1) { //wolf
        init_strip(0,1,0) //links, 7x5,pin0
        init_strip(1,1,1) //rechts, 7x5,pin1  
        basic.showString("M")
    }
    if (sname == 2) { //mb-cube
        init_strip(0,2,1) //standard, 8x8,pin0 
        init_strip(1,2,2) //standard, 8x8,pin1 
        init_strip(2,1,3) //standard, 5x7,pin2 
        basic.showString("C")
    }
}

function init_strip(snr: number, hwMatrix: number, pin: number) {
    
    //serial.writeLine( "init_strip:"+snr+":snr hwMatrix  " + hwMatrix +" pin:" + pin);

    arr_neop_settings[snr].pin = pin;
    arr_neop_settings[snr].hwMatrix = arr_tech_matrix[hwMatrix];

    let pixelAnzahl = arr_tech_matrix[hwMatrix][0] * arr_tech_matrix[hwMatrix][1]
    let strip = neopixel.create(arr_tech_pin[pin], pixelAnzahl, NeoPixelMode.RGB)
    neop_ges[snr] = strip
    strip.setBrightness(strip_helligkeit)
    strip.clear()
    strip.show()
    neo_strip_anzahl = Math.max(snr + 1, neo_strip_anzahl)

    //serial.writeLine(snr + ":snr len: "+neop_ranges.length+" "+neop_ranges[snr]+" "+arr_tech_matrix[hwMatrix][0]+"/"+arr_tech_matrix[hwMatrix][1]);

    let xstrip: neopixel.Strip[] =[]
    for (let z = 0; z < arr_tech_matrix[hwMatrix][1]; z++) {
        xstrip.push(neop_ges[snr].range(z * arr_tech_matrix[hwMatrix][0], arr_tech_matrix[hwMatrix][0]))
    }
    if (neop_ranges[snr]==undefined) {
        neop_ranges.push(xstrip)
    } else {
        neop_ranges[snr]=xstrip
    }
    
}

function set_punkt(snr:number=0,x: number, y:number, color: number) {
    const hwx = arr_neop_settings[snr].hwMatrix[0];
    const hwy = arr_neop_settings[snr].hwMatrix[1];
    //let px = (hwy-y-1)*hwy + ((y % 2) ? hwx-(x % hwx)-1:(x % hwx))
    let t= x 
    if ((y % 2)!=(hwy % 2)) {
       t=(hwx - 1 - x)
    }
    let px = (hwy-1-y) * hwx + t
    neop_ges[snr].setPixelColor(px, color);
    neop_ges[snr].show()
}


function get_bst_matrix(zch: string = "A",hwy:number) {
    let found = bst_reihe.indexOf(zch)
    if (found==-1) {
        found=0;
    }
    return arr_zeichen[found].slice(0,hwy)
}

function scrollen (zstrip: neopixel.Strip[],hy:number) {
    for (let strip = 0; strip < hy; strip++) {
        let sh = (strip % 2) ? -1:1
        zstrip[strip].shift(sh)
    }
}
function get_ystreifen(z_matrix:Array<number>,bit:number=0,x_add:number=0,color:number,zstrip:neopixel.Strip[],hx:number) {
    z_matrix.forEach(function (zahl, zeile) {
        if (zahl & Math.pow(2, bit)) {
            let b=bit+x_add
            let px=(zeile % 2) ? (hx-1-b):b
            zstrip[zeile].setPixelColor(px, color)
        }
    })
    
}
function frei_matrix(zch_str:string) {
    let ret="";
    let zch_len = zch_str.length
    if (zch_str.indexOf(";")>-1) {
        const arr_split = zch_str.split(";")
        arr_zeichen[80]=arr_split.map(wert => parseInt(wert));
        ret=";";
    };
    return ret
}    

function showtext (snr:number,txt:string="A",color:number,scroll_flag:boolean=false) {

    const hwx = arr_neop_settings[snr].hwMatrix[0];
    const hwy = arr_neop_settings[snr].hwMatrix[1];

    const center=Math.floor((hwx-zch_bit_breite)/2) 

    if (frei_matrix(txt)==";") {
        txt=";";
    }
    neop_ges[snr].clear()
    for (let bst_pos = 0; bst_pos < txt.length; bst_pos++) {
        if (!scroll_flag) {
            neop_ges[snr].clear()
        }
        //basic.showNumber(hwy)
        let zeichen_matrix:Array<number>=get_bst_matrix(txt[bst_pos],hwy)
        let str = zch_bit_breite;
        for (let s=str;s>=0;s--) {
            if (scroll_flag) {
                get_ystreifen(zeichen_matrix,s,-s,color,neop_ranges[snr],hwx)
                neop_ges[snr].show()
                basic.pause(pause_bst/10)
                scrollen(neop_ranges[snr],hwy)
            } else {
                get_ystreifen(zeichen_matrix,s,center,color,neop_ranges[snr],hwx)
                neop_ges[snr].show()
                basic.pause(80)
            }
        }
        if (!scroll_flag) {
            neop_ges[snr].show()
            if (txt.length>1) {
                basic.pause(pause_bst)
            }
        }    
    }
    if (hwx>zch_bit_breite) {
        neop_ges[snr].show()
    }
}


function init_alphabet () {
    // bstreihenfolge einhalten
    //           123456789 123456789 123456789 1234567895123456789 123456789 123456789 123456789 123456789 
    bst_reihe = "? ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789!?+-.:=≠,*abcdefghijklmnopqrstuvwxyzäöü;"; //50+31

    arr_zeichen = [
        [14,17,6,0,4],
        [0, 0, 0, 0, 0],
        [6,9,15,9,9],
        [14,9,14,9,14],
        [7,8,8,8,7],
        [14,9,9,9,14],
        [15,8,14,8,15],
        [15,8,14,8,8],
        [14,16,19,17,14],
        [9,9,15,9,9],
        [7,2,2,2,7],
        [31,2,2,18,12],
        [9,10,12,10,9],
        [8,8,8,8,15],
        [17, 27, 21,17,17],
        [17,25,21,19,17],
        [6,9,9,9,6],
        [14,9,14,8,8],
        [6,9,9,6,3],
        [14,9,14,9,9],
        [15,8,15,1,15],
        [31,4,4,4,4],
        [9,9,9,9,6],
        [17,17,17,10,4],
        [17,17,21,27,17],
        [17,10,4,10,17],
        [17,10,4,4,4],
        [15,2,4,8,15],
        [0,6,9,15,9],
        [6,6,9,9,6],
        [10,17,17,17,14],
        [6,9,9,9,6],
        [2,6,2,2,7],
        [14,1,6,8,15],
        [15,1,2,9,6],
        [6,10,18,31,2],
        [31,16,30,1,30],
        [15,8,15,9,15],
        [31,2,4,8,16],
        [15,9,15,9,15],
        [15,9,15,1,15],
            [2,2,2,0,2],
            [14,17,6,0,4],
        [0,4,14,4,0,], //+
        [0,0,14,0,0], //-
            [0,0,0,2,0],
            [0,2,0,2,0],
        [0,14,0,14,0], //=
        [2,31,4,31,8],
        [0,0,0,2,4],  //,
            [0,10,4,10,0],
    [0,14,18,18,15],
    [8,8,14,9,14],
    [0,7,8,8,7],
    [1,1,15,9,15],
    [6,9,14,8,6],
    [3,2,7,2,2],
    [7,9,7,1,6],
    [8,8,15,9,9],
    [2,0,2,2,2],
    [2,0,2,2,12],
    [8,10,12,10,9],
    [4,4,4,4,3],
    [0,27,21,17,17],
    [0,14,9,9,9],
    [0,6,9,9,6],
    [0,14,9,14,8],
    [0,7,9,7,1],
    [0,7,8,8,8],
    [0,3,4,2,12],
    [4,4,14,4,7],
    [0,18,18,18,15],
    [0,17,17,10,4],
    [0,17,17,21,27],
    [0,9,6,6,9],
    [0,17,10,4,24],
    [0,15,2,4,15],
        [7,1,7,9,6],
        [6,0,6,9,6],
        [6,0,9,9,6],
        [0, 0, 0, 0, 0]
    ]

}

input.onButtonPressed(Button.AB, function () {
    for (let s=0;s<neo_strip_anzahl;s++) {
        neop_ges[s].clear()
        neop_ges[s].show()
    }
})

function loesche_matrix(snr: number=0) {
    neop_ges[snr].clear()
    neop_ges[snr].show()
}

// muss sein, damit der index nicht fehlläuft
function default_strip_data() {
    // for (let s=0;s<neo_strip_anzahl;s++) {
    //     arr_neop_settings.push({ pin: arr_tech_pin[s], hwMatrix: arr_tech_matrix[s] })
    // }    
    //nicht ändern, sonst geht das nicht mehr
    arr_neop_settings.push({ pin: arr_tech_pin[0], hwMatrix: arr_tech_matrix[2] })
    arr_neop_settings.push({ pin: arr_tech_pin[1], hwMatrix: arr_tech_matrix[2] })
    arr_neop_settings.push({ pin: arr_tech_pin[2], hwMatrix: arr_tech_matrix[1] })
}



function set_helligkeit(helligkeit: number, zch_pause: number) {
    strip_helligkeit = helligkeit;
    pause_bst = zch_pause;
    for (let i = 0; i < neo_strip_anzahl; i++) {
        neop_ges[i].setBrightness(strip_helligkeit);
    }
}
function testen() {
    showtext (0,"1",neopixel.colors(NeoPixelColors.Red),true)
    showtext (1,"2",neopixel.colors(NeoPixelColors.Blue),true)
    showtext (0,"1",neopixel.colors(NeoPixelColors.Green),true)
    //showtext (2,"3",neopixel.colors(NeoPixelColors.Green),true)
}



// variable ########################################
interface neop {
    pin: number;
    hwMatrix: Array<number>;
}

// hardwareeinstellungen ########################### 3 Matriken
let arr_tech_matrix = [[5, 5],[5, 7], [8, 8], [16, 16]];
let arr_tech_pin = [DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P3, DigitalPin.P4, DigitalPin.P5, DigitalPin.P6, DigitalPin.P7, DigitalPin.P8];
// hardwareeinstellungen end ###########################

let neo_strip_anzahl: number = 1;
let shift: number = 0
let strip_helligkeit: number = 80;
let pause_bst: number = 2000; //auch scrollspeed
//let m_sname=-1
const zch_bit_breite:number=5

let arr_neop_settings: Array<neop> = []
let neop_ges: Array<neopixel.Strip> = []
let neop_ranges:Array<neopixel.Strip[]> = []


let arr_zeichen: number[][];
let bst_reihe: string = "";

// ende variable

//beginn initialisierung ############################
init_alphabet();
default_strip_data();
set_system(1);

// set_system(3);
// testen();

// ende Initialisierung

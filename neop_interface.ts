// Gib deinen Code hier ein

/**
 * Nutze diese Datei für benutzerdefinierte Funktionen und Blöcke.
 * Weitere Informationen unter https://makecode.microbit.org/blocks/custom
 */

enum sName {
    //% block="Standard"
    standard,
    //% block="MultiBox"
    multibox,
    //% block="MB-Cube"
    mbcube
}

enum nrMatrix {
    //% block="1"
    zentral,
    //% block="2"
    links,
    //% block="3"
    rechts
   }

enum HWMatrix {
    //% block="5x5"
    m0,
    //% block="5x7"
    m1,
    //% block="8x8"
    m2,
    //% block="16x16"
    m3
}



//% color=190 weight=100 icon="\uf00a" block="DLPL-Matrix"
namespace DLPLmatrix {

    /**
     * Standardmäßig ist ein Gesamtsystem mit 8x8 auf Pin 1 vordefiniert und benutzbar (Name: Haupt)
     * Es können aber auch weitere Systeme definiert verwendet werden (Namen: links und rechts)
    */

    //% group="Technische Definition"
    //% pin.defl=1    
    //% block="Die Matrix %snr mit Technik %hwMatrix ist an Pin %pin angeschlossen."
    //% weight=80 
    export function definitionMatrix(snr:nrMatrix,hwMatrix:HWMatrix,pin:number) {
        init_strip(snr,hwMatrix,pin)
    }

    
    //% helligkeit.defl=150 zch_pause.defl=2000
    //% block="Setze Helligkeit der Pixel auf %helligkeit, Pause bei einer Wortausgabe auf %zch_pause ms"
    //% zch_pause.shadow="timePicker"
    //% helligkeit.min=1 helligkeit.max=200
    //% weight=70

    export function all_strip_settings(helligkeit:number,zch_pause:number): void {
        set_helligkeit(helligkeit,zch_pause);
    }


    //% group="Befehle"
    //% txt.defl="ABC"
    //% block="Schreibe auf Matrix $snr den Text $txt mit Farbe $color mit Scrolling $scroll"
    //% color.shadow="colorNumberPicker"
    //% weight=50
    export function schreibeText(snr:nrMatrix,txt: string,color:number,scroll:boolean): void {
        showtext (snr,txt,color,scroll)
    }

    //% group="Befehle"
    //% x.defl=0 y.defl=0 $snr=0
    //% color.shadow="colorNumberPicker"
    //% weight=35
    //% block="Setze Koordinatenpunkt auf Matrix $snr x =$x y =$y Farbe $color (Nullpunkt: links unten)"
    export function setPunkt(x:number,y:number,color:number,snr:nrMatrix): void {
        set_punkt(snr,x,y,color)
    }

    //% group="Befehle"
    //% snr.defl=0
    //% block="Lösche Matrix %snr"
    //% weight=30
    export function loescheMatrix(snr:nrMatrix) {
        loesche_matrix(snr)
    }

    //% group="Erweiterung"
    //% sname.defl=1    
    //% block="Vordefiniertes Gesamtsystem wählen %sname (Standard, MultiBox, ...)."
    //% weight=20 
    export function definitionSystem(sname:sName) {
        set_system(sname)
    }


}

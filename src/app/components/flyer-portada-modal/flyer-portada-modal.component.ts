import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FLYER_GEN_URL } from '../../config/global';
import { AvisoFunebre } from '../../models/aviso-funebre';

export interface PortadaGenerada {
    file: File;
    dataUrl: string;
}

@Component({
    selector: 'app-flyer-portada-modal',
    templateUrl: './flyer-portada-modal.component.html',
    styleUrls: ['./flyer-portada-modal.component.css'],
})
export class FlyerPortadaModalComponent implements OnDestroy {
    @Input() aviso: AvisoFunebre;
    @Input() mode: 'create' | 'edit' = 'create';
    @Output() portadaGenerada = new EventEmitter<PortadaGenerada>();
    @Output() cerrado = new EventEmitter<void>();

    @ViewChild('iframe') iframeRef: ElementRef<HTMLIFrameElement>;

    visible = false;
    procesando = false;
    flyerReady = false;
    flyerSafeUrl: SafeResourceUrl;
    readonly flyerOrigin: string;

    constructor(private sanitizer: DomSanitizer) {
        // Trusted iframe URL (Angular requires bypass for dynamic URLs).
        this.flyerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${FLYER_GEN_URL}/?embed=1`
        );
        this.flyerOrigin = new URL(FLYER_GEN_URL).origin;
    }

    abrir(): void {
        this.visible = true;
        this.flyerReady = false;
        this.procesando = false;
    }

    cerrar(): void {
        this.visible = false;
        this.flyerReady = false;
        this.procesando = false;
        this.cerrado.emit();
    }

    ngOnDestroy(): void {
        this.visible = false;
    }

    @HostListener('window:message', ['$event'])
    onMessage(event: MessageEvent): void {
        if (!this.visible) return;
        if (event.origin !== this.flyerOrigin) return;
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        switch (data.type) {
            case 'FLYER_READY':
                this.flyerReady = true;
                this.enviarInit();
                break;
            case 'FLYER_RESULT':
                this.procesarResultado(data.jpgDataUrl);
                break;
            case 'FLYER_CANCEL':
                this.cerrar();
                break;
        }
    }

    private enviarInit(): void {
        const iframe = this.iframeRef && this.iframeRef.nativeElement;
        if (!iframe || !iframe.contentWindow) return;

        // Las fechas del aviso pueden venir como Date o como string ISO; normalizamos
        // a 'YYYY-MM-DD' que es el formato que el flyer-gen sabe interpretar.
        const isoDate = (val: any): string | undefined => {
            if (!val) return undefined;
            if (val instanceof Date) return val.toISOString().slice(0, 10);
            const s = val.toString();
            return s.length >= 10 ? s.slice(0, 10) : s;
        };

        const avisoPayload = {
            _id: this.aviso?._id,
            nombre_completo: this.aviso?.nombre_completo,
            fecha_nacimiento: isoDate(this.aviso?.fecha_nacimiento),
            fecha_defuncion: isoDate(this.aviso?.fecha_defuncion),
            fecha_entierro: isoDate(this.aviso?.fecha_entierro),
            hora_fallecimiento: this.aviso?.hora_fallecimiento,
            ubicacion_cementerio: this.aviso?.ubicacion_cementerio,
        };

        iframe.contentWindow.postMessage(
            { type: 'FLYER_INIT', aviso: avisoPayload, mode: this.mode },
            this.flyerOrigin
        );
    }

    private async procesarResultado(dataUrl: string): Promise<void> {
        if (!dataUrl) return;
        this.procesando = true;
        try {
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'portada.jpg', { type: 'image/jpeg' });
            this.portadaGenerada.emit({ file, dataUrl });
            this.cerrar();
        } catch (err) {
            console.error('Error procesando portada:', err);
            alert('No se pudo procesar la imagen generada.');
            this.procesando = false;
        }
    }
}

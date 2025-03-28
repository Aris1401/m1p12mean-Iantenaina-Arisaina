import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FactureService {
    constructor(private http: HttpClient) {}

    downloadFacture(idFacture: any) {
        this.http
            .get(environment.apiUrl + 'factures/' + idFacture + '/download', {
                responseType: 'blob',
                observe: 'response'
            })
            .subscribe((response : any) => {
                const blob = response.body!;
                const contentDisposition = response.headers.get('Content-Disposition');
                let fileName = 'downloaded-file'; // Default name

                console.log(response.headers)

                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.+)"/);
                    if (match) {
                        fileName = match[1]; // Extracts filename from header
                    }
                }

                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(objectUrl);
            });
    }

    downloadDevis(idDevis: any) {
        this.http.get(environment.apiUrl + 'factures/devis/' + idDevis + '/download', {
          responseType: 'blob',
          observe: 'response'
        }).subscribe((response : any) => {
          const blob = response.body!;
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName = 'downloaded-file'; // Default name

          console.log(response.headers)

          if (contentDisposition) {
              const match = contentDisposition.match(/filename="(.+)"/);
              if (match) {
                  fileName = match[1]; // Extracts filename from header
              }
          }

          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
      });
    }
}

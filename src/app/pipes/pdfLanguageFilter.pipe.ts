import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pdfLanguageFilter'
})
export class PdfLanguageFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let filterArray:any = [];
    for(var i=0; i<value.length;i++){
      let langIndex = value[i].items.findIndex(c => c.lang == args);
      let items;
      if(langIndex < 0 ){
        items = {};
      }else{
        items = value[i].items[langIndex];
      }
      filterArray.push({
        id : value[i].id,
        count : value[i].count,
        title : value[i].title,
        items : items
      });
    }
    return filterArray;
  }

}

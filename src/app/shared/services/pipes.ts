import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "removeUnderscore" })
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.replace(/_/g, " ");
  }
}

@Pipe({ name: "truncate" })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = true, ellipsis = "...") {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(" ");
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}
@Pipe({ name: "filter" })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      return it["title"].toLocaleLowerCase().includes(searchText) || it["short_description"].toLocaleLowerCase().includes(searchText) || it["org_name"].toLocaleLowerCase().includes(searchText);
    });
  }
}
@Pipe({ name: "filterDiscussion" })
export class filterDiscussionPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      /* console.log(it); */
      return it["type"].toLocaleLowerCase().includes(searchText) || it["title"].toLocaleLowerCase().includes(searchText) || it["name"].toLocaleLowerCase().includes(searchText);
    });
  }
}
@Pipe({ name: "filterPipeLines" })
export class filterPipeLinesPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      /* console.log(it); */
      return it["ucs_title"].toLocaleLowerCase().includes(searchText) || it["org_name"].toLocaleLowerCase().includes(searchText);
    });
  }
}

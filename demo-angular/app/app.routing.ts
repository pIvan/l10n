import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";

import { LocalizationResolve } from './locales/app.services';

const routes: Routes = [
    { path: "", redirectTo: "/items", pathMatch: "full", resolve: { localization: LocalizationResolve } },
    { path: "items", component: ItemsComponent, resolve: { localization: LocalizationResolve } },
    { path: "item/:id", component: ItemDetailComponent },
];


@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DataBindingComponent } from './components/demo/data-banding/data-banding.component';
import { InputOutputComponent } from './components/demo/input-output/input-output.component';
import { ParentComponent } from './components/demo/input-output/parent/parent.component';
import { ChildComponent } from './components/demo/input-output/child/child.component';
import { DirectivesComponent } from './components/demo/directives/directives.component';
import { PostComponent } from './components/post/post.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppComponent } from "./app.component";

@NgModule({
    declarations: [
        DataBindingComponent,
        InputOutputComponent,
        ParentComponent,
        ChildComponent,
        DirectivesComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        CommonModule,
        PostComponent,
        HeaderComponent,
        FooterComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

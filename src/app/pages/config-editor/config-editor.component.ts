import {Component, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {CdkDrag, CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-config-editor',
  imports: [
    CdkDrag,
    DragDropModule,
    RouterLink,
    FormsModule,
    NgStyle
  ],
  templateUrl: './config-editor.component.html',
  styleUrl: './config-editor.component.scss'
})
export class ConfigEditorComponent {
  protected IGTColor: ModelSignal<string> = model("#FFFFFF");
  protected RTAColor: ModelSignal<string> = model("#FFFFFF");
  protected STCColor: ModelSignal<string> = model("#FFFFFF");
  protected fontSize: ModelSignal<number> = model(28);

  protected IGTPosition = {x: 0, y: 0};
  protected RTAPosition = {x: 0, y: 0};
  protected STCPosition = {x: 0, y: 0};

  gridSize = 50; // Define your grid cell size

  snapToGrid(x: number, y: number): { x: number, y: number } {
    const snappedX = Math.round(x / this.gridSize) * this.gridSize;
    const snappedY = Math.round(y / this.gridSize) * this.gridSize;
    return {x: snappedX, y: snappedY};
  }

  protected onDragEnd(event: any): void {
    const { x, y } = event.source.getFreeDragPosition();
    const snappedPosition = this.snapToGrid(x, y);

    // Manually set the position of the dragged element
    event.source._dragRef.setFreeDragPosition(snappedPosition);

    // Get the user's screen size
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate the scaling factor
    const scaleX = 2560 / screenWidth;
    const scaleY = 1440 / screenHeight;

    // Adjust the positions based on the scaling factor
    const scaledPosition = {
      x: (snappedPosition.x * scaleX) - 1180,
      y: -(snappedPosition.y * scaleY) + 1380
    };

    // Update the position based on the dragged element
    switch (event.source.data) {
      case 'IGT':
        this.IGTPosition = scaledPosition;
        break;
      case 'RTA':
        this.RTAPosition = scaledPosition;
        break;
      case 'STC':
        this.STCPosition = scaledPosition;
        break;
    }
  }

  protected exportConfig(): void {
    const config = `[Color]
STC_Color=${this.STCColor().replace('#', '')}
RTA_Color=${this.RTAColor().replace('#', '')}
IGT_Color=${this.IGTColor().replace('#', '')}
Split_Color=6a7ebd
F3_Color=ffffff

[Position]
IGT_Position=${Math.round(this.IGTPosition.x)}.0,${Math.round(this.IGTPosition.y)}.0
RTA_Position=${Math.round(this.RTAPosition.x)}.0,${Math.round(this.RTAPosition.y)}.0
STC_Position=${Math.round(this.STCPosition.x)}.0,${Math.round(this.STCPosition.y)}.0
F3_Position=-450.0,200.0

[Scale]
Font_Size=${this.fontSize()}`;

    const blob = new Blob([config], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speedrun_settings.cfg';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

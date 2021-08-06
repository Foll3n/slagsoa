import {CalendarEvent} from 'angular-calendar';
import { EventColor, EventAction } from 'calendar-utils';

// @ts-ignore
export class CalendarCraEvent implements CalendarEvent {
  constructor(
    private start: Date,
    private title: string,
    private duree: number
  ) {
  }

  id?: string | number | undefined;
    end?: Date | undefined;
    color?: EventColor | undefined;
    actions?: EventAction[] | undefined;
    allDay?: boolean | undefined;
    cssClass?: string | undefined;
    resizable?: { beforeStart?: boolean | undefined; afterEnd?: boolean | undefined; } | undefined;
    draggable?: boolean | undefined;
    meta?: any;




}

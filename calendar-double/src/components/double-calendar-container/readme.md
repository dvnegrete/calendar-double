# double-calendar-container



<!-- Auto Generated Below -->


## Events

| Event                        | Description | Type                              |
| ---------------------------- | ----------- | --------------------------------- |
| `dvn-arrayDatesSelected`     |             | `CustomEvent<(string \| Date)[]>` |
| `dvn-changeCleanPeriod`      |             | `CustomEvent<any>`                |
| `dvn-cleanCalendarSelection` |             | `CustomEvent<any>`                |
| `dvn-closeDoubleCalendar`    |             | `CustomEvent<boolean>`            |


## Dependencies

### Used by

 - [calendar-input-selection](../calendar-input-selection)

### Depends on

- [calendar-double](../calendar-double)

### Graph
```mermaid
graph TD;
  double-calendar-container --> calendar-double
  calendar-double --> calendar-single
  calendar-single --> header-calendar
  calendar-input-selection --> double-calendar-container
  style double-calendar-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

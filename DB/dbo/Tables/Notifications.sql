CREATE TABLE [dbo].[Notifications] (
    [NotificationId] UNIQUEIDENTIFIER NOT NULL,
    [Subject]        VARCHAR (250)    NOT NULL,
    [Body]           VARCHAR (MAX)    NOT NULL,
    [Created]        DATETIME         NOT NULL,
    [CreatedById]    NVARCHAR (450)   NULL,
    [EventSiteId]    INT              NULL,
    [EventId]        INT              NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([NotificationId] ASC),
    CONSTRAINT [FK_Notifications_AspNetUsers] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AspNetUsers] ([Id]),
    CONSTRAINT [FK_Notifications_CalendarEvents] FOREIGN KEY ([EventId]) REFERENCES [dbo].[CalendarEvents] ([Id]),
    CONSTRAINT [FK_Notifications_EventSites] FOREIGN KEY ([EventSiteId]) REFERENCES [dbo].[EventSites] ([Id])
);


GO
ALTER TABLE [dbo].[Notifications] NOCHECK CONSTRAINT [FK_Notifications_CalendarEvents];


GO
ALTER TABLE [dbo].[Notifications] NOCHECK CONSTRAINT [FK_Notifications_EventSites];


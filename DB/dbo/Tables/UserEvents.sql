CREATE TABLE [dbo].[UserEvents] (
    [UserId]      NVARCHAR (450) NOT NULL,
    [EventId]     INT            NOT NULL,
    [Created]     DATETIME2 (7)  NOT NULL,
    [CreatedById] NVARCHAR (450) NULL,
    [Attended]    BIT            NULL,
    [Comment]     NVARCHAR (MAX) NULL,
    [OldUserId]   INT            NULL,
    [OldEventId]  INT            NULL,
    CONSTRAINT [PK_UserEvents] PRIMARY KEY CLUSTERED ([UserId] ASC, [EventId] ASC),
    CONSTRAINT [FK_UserEvents_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AspNetUsers] ([Id]),
    CONSTRAINT [FK_UserEvents_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserEvents_CalendarEvents_EventId] FOREIGN KEY ([EventId]) REFERENCES [dbo].[CalendarEvents] ([Id]) ON DELETE CASCADE
);


CREATE TABLE [dbo].[Photos] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [EventId]  INT            NOT NULL,
    [FileName] NVARCHAR (MAX) NULL,
    [Uploaded] DATETIME2 (7)  NOT NULL,
    [Width]    INT            NOT NULL,
    [Height]   INT            NOT NULL,
    [Url]      NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_Photos] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Photos_CalendarEvents_EventId] FOREIGN KEY ([EventId]) REFERENCES [dbo].[CalendarEvents] ([Id]) ON DELETE CASCADE
);


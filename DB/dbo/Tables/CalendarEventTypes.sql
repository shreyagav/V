CREATE TABLE [dbo].[CalendarEventTypes] (
    [Id]    INT            IDENTITY (1, 1) NOT NULL,
    [Title] NVARCHAR (MAX) NULL,
    [OldId] INT            NOT NULL,
    [Color] NVARCHAR (MAX) NULL,
    [Order] TINYINT        NOT NULL,
    CONSTRAINT [PK_CalendarEventTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
);


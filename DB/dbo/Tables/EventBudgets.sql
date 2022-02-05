CREATE TABLE [dbo].[EventBudgets] (
    [Id]          INT             IDENTITY (1, 1) NOT NULL,
    [EventId]     INT             NOT NULL,
    [Name]        NVARCHAR (MAX)  NULL,
    [Description] NVARCHAR (MAX)  NULL,
    [Quantity]    DECIMAL (18, 2) NOT NULL,
    [Cost]        DECIMAL (18, 2) NOT NULL,
    CONSTRAINT [PK_EventBudgets] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_EventBudgets_CalendarEvents_EventId] FOREIGN KEY ([EventId]) REFERENCES [dbo].[CalendarEvents] ([Id]) ON DELETE CASCADE
);


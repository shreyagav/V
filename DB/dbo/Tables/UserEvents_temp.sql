CREATE TABLE [dbo].[UserEvents_temp] (
    [UserId]      NVARCHAR (450) NOT NULL,
    [EventId]     INT            NOT NULL,
    [Created]     DATETIME2 (7)  NOT NULL,
    [CreatedById] NVARCHAR (450) NULL,
    [Attended]    BIT            NULL,
    [Comment]     NVARCHAR (MAX) NULL,
    [OldUserId]   INT            NULL,
    [OldEventId]  INT            NULL,
    CONSTRAINT [PK_UserEvents_temp] PRIMARY KEY CLUSTERED ([UserId] ASC, [EventId] ASC)
);


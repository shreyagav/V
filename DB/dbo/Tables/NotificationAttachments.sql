CREATE TABLE [dbo].[NotificationAttachments] (
    [NotificationAttachmentId] UNIQUEIDENTIFIER NOT NULL,
    [NotificationId]           UNIQUEIDENTIFIER NOT NULL,
    [Size]                     INT              NOT NULL,
    [Name]                     NVARCHAR (250)   NOT NULL,
    [Uploaded]                 DATETIME         NULL,
    CONSTRAINT [PK_NotificationAttachments] PRIMARY KEY CLUSTERED ([NotificationAttachmentId] ASC),
    CONSTRAINT [FK_NotificationAttachments_Notifications] FOREIGN KEY ([NotificationId]) REFERENCES [dbo].[Notifications] ([NotificationId])
);


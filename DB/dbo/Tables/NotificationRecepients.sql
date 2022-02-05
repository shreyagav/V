CREATE TABLE [dbo].[NotificationRecepients] (
    [NotificationId]          UNIQUEIDENTIFIER NOT NULL,
    [UserId]                  NVARCHAR (450)   NOT NULL,
    [Sent]                    DATETIME         NULL,
    [HasError]                BIT              NOT NULL,
    [Error]                   NVARCHAR (MAX)   NULL,
    [NotificationRecepientId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_NotificationRecepients] PRIMARY KEY CLUSTERED ([NotificationRecepientId] ASC),
    CONSTRAINT [FK_NotificationRecepients_AspNetUsers] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]),
    CONSTRAINT [FK_NotificationRecepients_Notifications] FOREIGN KEY ([NotificationId]) REFERENCES [dbo].[Notifications] ([NotificationId])
);


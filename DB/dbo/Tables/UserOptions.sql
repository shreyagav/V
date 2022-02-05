CREATE TABLE [dbo].[UserOptions] (
    [OptionId]    INT            NOT NULL,
    [UserId]      NVARCHAR (450) NOT NULL,
    [Description] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_UserOptions] PRIMARY KEY CLUSTERED ([OptionId] ASC, [UserId] ASC),
    CONSTRAINT [FK_UserOptions_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserOptions_Options_OptionId] FOREIGN KEY ([OptionId]) REFERENCES [dbo].[Options] ([Id]) ON DELETE CASCADE
);


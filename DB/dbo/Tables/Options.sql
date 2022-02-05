CREATE TABLE [dbo].[Options] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [OptionCategoryId] INT            NOT NULL,
    [Title]            NVARCHAR (MAX) NULL,
    [Description]      NVARCHAR (MAX) NULL,
    [OldId]            INT            NOT NULL,
    CONSTRAINT [PK_Options] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Options_OptionCategories_OptionCategoryId] FOREIGN KEY ([OptionCategoryId]) REFERENCES [dbo].[OptionCategories] ([Id]) ON DELETE CASCADE
);


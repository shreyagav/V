CREATE TABLE [dbo].[OptionCategories] (
    [Id]    INT            IDENTITY (1, 1) NOT NULL,
    [OldId] INT            NOT NULL,
    [Name]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_OptionCategories] PRIMARY KEY CLUSTERED ([Id] ASC)
);


CREATE TABLE [dbo].[Contacts] (
    [Id]    INT            IDENTITY (1, 1) NOT NULL,
    [Name]  NVARCHAR (MAX) NULL,
    [Email] NVARCHAR (MAX) NULL,
    [Phone] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_Contacts] PRIMARY KEY CLUSTERED ([Id] ASC)
);


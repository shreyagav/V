CREATE TABLE [dbo].[SystemCodes] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [CodeType]    NVARCHAR (2)  NULL,
    [Description] NVARCHAR (50) NULL,
    [OldId]       INT           NOT NULL,
    CONSTRAINT [PK_SystemCodes] PRIMARY KEY CLUSTERED ([Id] ASC)
);


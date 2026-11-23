import pytest

from sloperator.errors import LexicalError
from sloperator.lexer import tokenize
from sloperator.runner import run_source


def test_unterminated_string_at_trailing_backslash_reports_lexical_error():
    with pytest.raises(LexicalError) as info:
        tokenize("“a\\")
    assert info.value.line == 1
    assert info.value.message == "unterminated string"
    assert str(info.value) == "SlopLang lexical error at line 1: unterminated string"


def test_unterminated_string_at_trailing_backslash_surfaces_through_runner():
    result = run_source("hallucinate(“a\\")
    assert result.stdout == ""
    assert result.stderr == "SlopLang lexical error at line 1: unterminated string\n"
    assert result.exit_code == 1
